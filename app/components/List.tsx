import { Next } from "@navikt/ds-icons";
import cl from "classnames";
import React, { useContext } from "react";
import { AppContext } from "../pages/index";

const List = () => {
  const { setActiveView, activeView, data } = useContext(AppContext);

  if (!data) return null;

  return (
    <div className="max-h-screen max-w-xl overflow-y-auto bg-gray-900 text-gray-100">
      {data.map((imp, x) => (
        <button
          key={x}
          className={cl(
            "inline-flex w-full items-center px-4 py-4 focus:outline-none",
            {
              "text-text bg-gray-50 ": activeView?.name === imp.name,
              "hover:bg-gray-800": activeView?.name !== imp.name,
            }
          )}
          onClick={() => setActiveView(imp)}
          onFocus={() => setActiveView(imp)}
        >
          <div
            className={cl(
              "inline-flex min-w-full justify-between text-base font-semibold"
            )}
          >
            <span>{imp.name.replace("@navikt/", "")}</span>
            <span className="flex items-center gap-2">
              <span className="mr-2">{imp.value.uses}</span>
              <Next aria-hidden />
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default List;
