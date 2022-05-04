import { Label } from "@navikt/ds-react";
import { unstable_useRefreshRoot as useRefreshRoot } from "next/streaming";
import cl from "classnames";

const ListButton = ({ children, counter, ...rest }) => {
  /* const [isPending, startTransition] = useTransition(); */
  const refresh = useRefreshRoot();

  return (
    <button
      onClick={() => refresh({ ...rest, selectedPackage: children })}
      className={cl(
        "focus:shadow-focus-inset flex w-11/12 items-center justify-between rounded-lg border-none bg-purple-50 px-6 py-4 text-left focus:outline-none",
        { "bg-blue-200": rest.selectedPackage === children }
      )}
    >
      <Label>{children}</Label>
      <span>
        {rest.selectedPackage === children ? (
          <svg
            width="1.3em"
            height="1.3em"
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
        ) : (
          <Label>{counter}</Label>
        )}
      </span>
    </button>
  );
};

export default ListButton;
