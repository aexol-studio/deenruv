import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-stone-950 dark:focus-visible:ring-stone-300',
    {
        variants: {
            variant: {
                default:
                    'bg-stone-900 text-white hover:bg-stone-800 focus:ring-2 focus:ring-stone-600 dark:bg-stone-50 dark:text-stone-900 dark:hover:bg-stone-200',
                destructive:
                    'bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-400 dark:bg-red-900 dark:text-white dark:hover:bg-red-800',
                action: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600',
                outline:
                    'border border-stone-300 bg-white text-stone-900 hover:bg-stone-100 focus:ring-2 focus:ring-stone-400 dark:border-stone-700 dark:bg-transparent dark:text-stone-50 dark:hover:bg-stone-800',
                secondary:
                    'bg-stone-100 text-stone-900 hover:bg-stone-200 focus:ring-2 focus:ring-stone-300 dark:bg-stone-800 dark:text-stone-50 dark:hover:bg-stone-700',
                ghost: 'text-stone-900 hover:bg-stone-100 focus:ring-2 focus:ring-stone-300 dark:text-stone-50 dark:hover:bg-stone-800',
                'navigation-link':
                    'text-navigation-link opacity-70 hover:opacity-100 focus:opacity-100 focus:ring-2 focus:ring-navigation-link/50 dark:opacity-80 dark:hover:opacity-100 dark:focus:ring-navigation-link/50',
                link: 'text-stone-900 underline-offset-4 hover:underline focus:ring-2 focus:ring-stone-400 dark:text-stone-50',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);
