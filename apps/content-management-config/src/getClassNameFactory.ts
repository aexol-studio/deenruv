import classnames from "classnames";

type OptionsObj = Record<string, any>;
type Options = string | OptionsObj;

export const getClassNameFactory =
  (
    rootClass: string,
    styles: Record<string, string>,
    config: { baseClass?: string } = { baseClass: "" }
  ) =>
  (options: Options = {}) => {
    if (typeof options === "string") {
      const descendant = options;

      const style = styles[`${rootClass}-${descendant}`];

      if (style) {
        return config.baseClass + styles[`${rootClass}-${descendant}`] || "";
      }

      return "";
    } else if (typeof options === "object") {
      const modifiers = options;

      const prefixedModifiers: OptionsObj = {};

      for (let modifier in modifiers) {
        prefixedModifiers[styles[`${rootClass}--${modifier}`]] =
          modifiers[modifier];
      }

      const c = styles[rootClass];

      return (
        config.baseClass +
        classnames({
          [c]: !!c, // only apply the class if it exists
          ...prefixedModifiers,
        })
      );
    } else {
      return config.baseClass + styles[rootClass] || "";
    }
  };
