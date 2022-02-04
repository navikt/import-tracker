import { Next } from "@navikt/ds-icons";
import cl from "classnames";
import React, { useContext } from "react";
import { AppContext } from "../pages/index";

const List = () => {
  const { setActiveView, activeView, data } = useContext(AppContext);

  if (!data) return null;

  return (
    <div className="max-w-xl bg-gray-900 text-gray-100 max-h-screen overflow-y-auto">
      {data.map((imp) => (
        <button
          className={cl(
            "w-full inline-flex items-center px-4 py-4 focus:outline-none",
            {
              "bg-gray-50 text-text ": activeView?.name === imp.name,
              "hover:bg-gray-800": activeView?.name !== imp.name,
            }
          )}
          onClick={() => setActiveView(imp)}
          onFocus={() => setActiveView(imp)}
        >
          <div
            className={cl(
              "inline-flex justify-between min-w-full font-semibold text-base"
            )}
          >
            <span>{imp.name.replace("@navikt/", "")}</span>
            <span className="flex gap-2 items-center">
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
