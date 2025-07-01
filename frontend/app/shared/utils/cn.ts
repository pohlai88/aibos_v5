/**
 * cn - Class Names Utility
 *
 * Combines class names conditionally, similar to the popular 'classnames' package.
 * Usage: cn('foo', condition && 'bar', ['baz', anotherCondition && 'qux'])
 */
export function cn(...args: any[]): string {
  const classes: string[] = [];

  args.forEach((arg) => {
    if (!arg) return;
    if (typeof arg === "string") {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      classes.push(cn(...arg));
    } else if (typeof arg === "object") {
      Object.entries(arg).forEach(([key, value]) => {
        if (value) classes.push(key);
      });
    }
  });

  return classes.join(" ");
}

export default cn;
