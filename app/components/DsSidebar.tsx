import { Left } from "@navikt/ds-icons";
import { Label } from "@navikt/ds-react";
import cl from "classnames";
import NextLink from "next/link";
import { useRouter } from "next/router";

const DsSidebar = () => {
  const router = useRouter();

  return (
    <div className="flex max-h-screen min-h-screen w-full max-w-xs flex-col items-center bg-gray-50 shadow-lg">
      <NextLink prefetch={false} href="/" passHref>
        <a className="mt-2 flex items-center justify-center gap-2 py-4">
          <Left /> Tilbake til pakke-oversikt
        </a>
      </NextLink>
      <div className="flex h-full w-full flex-col items-center gap-2 overflow-auto pt-4 pb-2">
        <NextLink prefetch={false} href={"/ds/@navikt__ds-react"} passHref>
          <a
            className={cl(
              "w-full scroll-m-72",
              "focus:shadow-focus-inset flex w-11/12 items-center justify-between rounded-lg border-none  px-6 py-4 text-left focus:outline-none",
              {
                "text-text-inverted bg-blue-900/60 hover:bg-blue-900/50":
                  router.asPath === "/ds/@navikt__ds-react",
                "bg-blue-900/20 hover:bg-blue-900/30":
                  router.asPath !== "/ds/@navikt__ds-react",
              }
            )}
          >
            <Label className="break-all">@navikt/ds-react</Label>
          </a>
        </NextLink>
        <NextLink
          prefetch={false}
          href={"/ds/@navikt__ds-react-internal"}
          passHref
        >
          <a
            className={cl(
              "w-full scroll-m-72",
              "focus:shadow-focus-inset flex w-11/12 items-center justify-between rounded-lg border-none  px-6 py-4 text-left focus:outline-none",
              {
                "text-text-inverted bg-blue-900/60 hover:bg-blue-900/50":
                  router.asPath === "/ds/@navikt__ds-react-internal",
                "bg-blue-900/20 hover:bg-blue-900/30":
                  router.asPath !== "/ds/@navikt__ds-react-internal",
              }
            )}
          >
            <Label className="break-all">@navikt/ds-react-internal</Label>
          </a>
        </NextLink>
        <NextLink prefetch={false} href={"/ds/@navikt__ds-icons"} passHref>
          <a
            className={cl(
              "w-full scroll-m-72",
              "focus:shadow-focus-inset flex w-11/12 items-center justify-between rounded-lg border-none  px-6 py-4 text-left focus:outline-none",
              {
                "text-text-inverted bg-blue-900/60 hover:bg-blue-900/50":
                  router.asPath === "/ds/@navikt__ds-icons",
                "bg-blue-900/20 hover:bg-blue-900/30":
                  router.asPath !== "/ds/@navikt__ds-icons",
              }
            )}
          >
            <Label className="break-all">@navikt/ds-icons</Label>
          </a>
        </NextLink>
      </div>
    </div>
  );
};

export default DsSidebar;
