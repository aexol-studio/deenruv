'use client';

import type React from 'react';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@deenruv/react-ui-devkit';

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

interface JsonPropertyProps {
  name: string;
  value: JsonValue;
  depth: number;
  isLast: boolean;
}

const JsonProperty: React.FC<JsonPropertyProps> = ({ name, value, depth, isLast }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const indent = depth * 20;

  const isExpandable = value !== null && (typeof value === 'object' || Array.isArray(value));

  const toggleExpand = () => {
    if (isExpandable) {
      setIsExpanded(!isExpanded);
    }
  };

  const renderValue = () => {
    if (value === null) return <span className="text-gray-500">null</span>;

    if (typeof value === 'boolean') return <span className="text-blue-600">{value.toString()}</span>;

    if (typeof value === 'number') return <span className="text-green-600">{value}</span>;

    if (typeof value === 'string') return <span className="text-amber-600">{value}</span>;

    if (Array.isArray(value)) {
      if (!isExpanded) {
        return (
          <span className="cursor-pointer text-gray-500" onClick={toggleExpand}>
            {'>'}
          </span>
        );
      }

      return (
        <div>
          {value.map((item, index) => (
            <div key={index} style={{ marginLeft: 20 }}>
              <JsonProperty
                name={index.toString()}
                value={item}
                depth={depth + 1}
                isLast={index === value.length - 1}
              />
            </div>
          ))}
        </div>
      );
    }

    if (typeof value === 'object') {
      if (!isExpanded) {
        return (
          <span className="cursor-pointer text-gray-500" onClick={toggleExpand}>
            {'>'}
          </span>
        );
      }

      const entries = Object.entries(value);
      return (
        <div>
          {entries.map(([key, val], index) => (
            <JsonProperty key={key} name={key} value={val} depth={depth + 1} isLast={index === entries.length - 1} />
          ))}
        </div>
      );
    }

    return <span>{String(value)}</span>;
  };

  return (
    <div
      className={cn(
        'py-0.5 font-mono text-sm',
        !isLast && isExpanded && isExpandable ? 'border-l border-gray-200 dark:border-gray-700' : '',
      )}
      style={{ paddingLeft: indent }}
    >
      <div className="flex items-center">
        {isExpandable && (
          <button onClick={toggleExpand} className="mr-1 rounded p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800">
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
        )}
        {isExpandable && !isExpanded ? (
          <div>
            <span className="text-gray-600 dark:text-gray-400">{name}: </span>
            {renderValue()}
          </div>
        ) : (
          <div>
            <span className="text-gray-600 dark:text-gray-400">{name}: </span>
            {renderValue()}
          </div>
        )}
      </div>
    </div>
  );
};

interface JsonExplorerProps {
  data: JsonObject;
  className?: string;
}

export function JsonExplorer({ data, className }: JsonExplorerProps) {
  const entries = Object.entries(data);

  return (
    <div className={cn('overflow-auto rounded-lg bg-white p-4 dark:bg-gray-950', className)}>
      {entries.map(([key, value], index) => (
        <JsonProperty key={key} name={key} value={value} depth={0} isLast={index === entries.length - 1} />
      ))}
    </div>
  );
}
