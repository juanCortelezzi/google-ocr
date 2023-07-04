import { tv } from "tailwind-variants";

export const buttonVariants = tv({
  base: "inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-2 border-2 border-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-black",
  variants: {
    variant: {
      default: "bg-white hover:bg-gray-300 text-black",
      outline: "bg-black hover:bg-white hover:text-black",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
