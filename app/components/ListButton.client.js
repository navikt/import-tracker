import { Label } from "@navikt/ds-react";
import cl from "classnames";
import { unstable_useRefreshRoot as useRefreshRoot } from "next/streaming";

const ListButton = ({ children, counter, index, ...rest }) => {
  const refresh = useRefreshRoot();

  return (
    <button
      onClick={() =>
        refresh({ ...rest, selectedPackage: children, dataFilter: "default" })
      }
      className={cl(
        "focus:shadow-focus-inset flex w-11/12 items-center justify-between rounded-lg border-none  px-6 py-4 text-left focus:outline-none",
        {
          "text-text-inverted bg-blue-900/60 hover:bg-blue-900/50":
            rest.selectedPackage === children,
          "bg-blue-900/20 hover:bg-blue-900/30":
            rest.selectedPackage !== children,
        }
      )}
    >
      <Label>
        {`${index}. `}
        {children}
      </Label>
      <span>
        <Label>{counter}</Label>
      </span>
    </button>
  );
};

export default ListButton;
