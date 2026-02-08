import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = path.resolve(__dirname, '../../');
const CHANGELOG_PATH = path.join(ROOT, 'CHANGELOG.md');
const REPO_URL = 'https://github.com/aexol-studio/deenruv';

// --- CLI argument parsing ---

function parseArgs(): { nextVersion: string; fromTag: string } {
  const args = process.argv.slice(2);
  let nextVersion = '';
  let fromTag = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--next-version' && args[i + 1]) {
      nextVersion = args[i + 1];
      i++;
    } else if (args[i] === '--from-tag' && args[i + 1]) {
      fromTag = args[i + 1];
      i++;
    } else if (args[i].startsWith('--next-version=')) {
      nextVersion = args[i].split('=')[1];
    } else if (args[i].startsWith('--from-tag=')) {
      fromTag = args[i].split('=')[1];
    }
  }

  if (!nextVersion) {
    console.error('Error: --next-version is required');
    process.exit(1);
  }

  if (!fromTag) {
    try {
      fromTag = execSync('git describe --tags --abbrev=0', { cwd: ROOT, encoding: 'utf-8' }).trim();
    } catch {
      // No tags exist — use first commit
      fromTag = execSync('git rev-list --max-parents=0 HEAD', { cwd: ROOT, encoding: 'utf-8' }).trim();
    }
  }

  return { nextVersion, fromTag };
}

// --- Commit types ---

interface ParsedCommit {
  hash: string;
  shortHash: string;
  type: string;
  scope: string;
  subject: string;
  full: string;
}

const TYPE_LABELS: Record<string, string> = {
  feat: 'Features',
  fix: 'Fixes',
  perf: 'Performance',
  docs: 'Documentation',
  refactor: 'Refactoring',
  chore: 'Chores',
  test: 'Tests',
  ci: 'CI',
  build: 'Build',
  style: 'Style',
  other: 'Other',
};

const TYPE_ORDER = ['feat', 'fix', 'perf', 'docs', 'refactor', 'chore', 'test', 'ci', 'build', 'style', 'other'];

// Commits to exclude (release housekeeping)
const EXCLUDE_PATTERNS = [
  /^chore\(release\):/,
  /^chore: prepare workspace/,
  /^chore: stabilize build/,
  /^chore: apply lint auto-fixes/,
];

// --- Functions ---

function getCommitsSinceTag(fromRef: string): string[] {
  try {
    const raw = execSync(`git log ${fromRef}..HEAD --format="%H|||%h|||%s"`, {
      cwd: ROOT,
      encoding: 'utf-8',
    }).trim();

    if (!raw) return [];
    return raw.split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

function parseCommit(line: string): ParsedCommit | null {
  const parts = line.split('|||');
  if (parts.length < 3) return null;

  const [hash, shortHash, subject] = parts;

  // Exclude release housekeeping
  for (const pattern of EXCLUDE_PATTERNS) {
    if (pattern.test(subject)) return null;
  }

  // Parse conventional commit format: type(scope): message
  const match = subject.match(/^(\w+)(?:\(([^)]*)\))?\s*:\s*(.+)$/);
  if (match) {
    return {
      hash,
      shortHash,
      type: match[1],
      scope: match[2] || '',
      subject: match[3].trim(),
      full: subject,
    };
  }

  // Non-conventional commit
  return {
    hash,
    shortHash,
    type: 'other',
    scope: '',
    subject: subject.trim(),
    full: subject,
  };
}

function groupByType(commits: ParsedCommit[]): Map<string, ParsedCommit[]> {
  const groups = new Map<string, ParsedCommit[]>();

  for (const commit of commits) {
    const type = TYPE_LABELS[commit.type] ? commit.type : 'other';
    if (!groups.has(type)) groups.set(type, []);
    groups.get(type)!.push(commit);
  }

  return groups;
}

function formatSection(version: string, groups: Map<string, ParsedCommit[]>): string {
  const date = new Date().toISOString().slice(0, 10);
  const lines: string[] = [];

  lines.push(`## <small>${version} (${date})</small>`);
  lines.push('');

  for (const type of TYPE_ORDER) {
    const commits = groups.get(type);
    if (!commits || commits.length === 0) continue;

    const label = TYPE_LABELS[type] || type.charAt(0).toUpperCase() + type.slice(1);
    lines.push(`#### ${label}`);
    lines.push('');

    for (const commit of commits) {
      const scopePart = commit.scope ? `**${commit.scope}** ` : '';
      lines.push(`-   ${scopePart}${commit.subject} ([${commit.shortHash}](${REPO_URL}/commit/${commit.hash}))`);
    }

    lines.push('');
  }

  return lines.join('\n');
}

function versionAlreadyExists(content: string, version: string): boolean {
  // Match version in heading like: ## <small>1.0.6 (2025-01-01)</small> or ## 1.0.6
  const escaped = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^##\\s.*${escaped}`, 'm').test(content);
}

// --- Main ---

function main() {
  const { nextVersion, fromTag } = parseArgs();

  console.log(`Generating changelog for v${nextVersion} from ${fromTag}..HEAD`);

  const rawCommits = getCommitsSinceTag(fromTag);
  if (rawCommits.length === 0) {
    console.log('No commits found since last tag. Nothing to add.');
    process.exit(0);
  }

  const parsed = rawCommits.map(parseCommit).filter((c): c is ParsedCommit => c !== null);
  if (parsed.length === 0) {
    console.log('No relevant commits found (all were filtered out). Nothing to add.');
    process.exit(0);
  }

  console.log(`Found ${parsed.length} commits to include.`);

  const groups = groupByType(parsed);
  const section = formatSection(nextVersion, groups);

  // Read existing changelog
  let existing = '';
  if (fs.existsSync(CHANGELOG_PATH)) {
    existing = fs.readFileSync(CHANGELOG_PATH, 'utf-8');
  }

  // Check for duplicate version
  if (versionAlreadyExists(existing, nextVersion)) {
    console.log(`Version ${nextVersion} already exists in CHANGELOG.md. Skipping.`);
    process.exit(0);
  }

  // Prepend new section
  const updated = section + '\n' + existing;
  fs.writeFileSync(CHANGELOG_PATH, updated, 'utf-8');

  console.log(`✓ CHANGELOG.md updated with ${nextVersion}`);
}

main();
