import Next from "@navikt/ds-icons/svg/Next.svg";
import { Label } from "@navikt/ds-react";

const ListButton = ({ children, counter }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <button className="focus:shadow-focus-inset-inverted flex w-11/12 items-center justify-between rounded-lg border-none bg-purple-50 px-6 py-4 text-left focus:outline-none">
      <Label>{children}</Label>
      <span>
        <Label>{counter}</Label>
        <svg
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          focusable={false}
          role="img"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17 12L8.429 3 7 4.5l7.143 7.5L7 19.5 8.429 21 17 12z"
            fill="currentColor"
          />
        </svg>
      </span>
    </button>
  );
};

export default ListButton;
