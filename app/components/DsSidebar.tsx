import { Left } from "@navikt/ds-icons";
import { Label } from "@navikt/ds-react";
import cl from "classnames";
import NextLink from "next/link";
import { useRouter } from "next/router";

const Link = ({ name }: { name: string }) => {
  const router = useRouter();
  return (
    <NextLink prefetch={false} href={`/ds/${name}`} passHref>
      <a
        className={cl(
          "w-full scroll-m-72",
          "focus:shadow-focus-inset flex w-11/12 items-center justify-between rounded-lg border-none px-2 py-2 text-left focus:outline-none",
          {
            "text-text-inverted bg-blue-900/60 hover:bg-blue-900/50":
              router.asPath === `/ds/${name}`,
            "bg-blue-900/10 hover:bg-blue-900/30":
              router.asPath !== `/ds/${name}`,
          }
        )}
      >
        <Label className="break-all">{name}</Label>
      </a>
    </NextLink>
  );
};

const DsSidebar = () => {
  return (
    <div className="flex max-h-screen min-h-screen w-full max-w-xs flex-col items-center bg-gray-50 shadow-lg">
      <NextLink prefetch={false} href="/" passHref>
        <a className="mt-2 flex items-center justify-center gap-2 py-4">
          <Left /> Tilbake til pakkeoversikt
        </a>
      </NextLink>
      <div className="flex h-full w-full flex-col items-center gap-2 overflow-auto pt-4 pb-2">
        <Link name="@navikt/ds-react" />
        <Link name="@navikt/ds-react-internal" />
        <Link name="@navikt/ds-icons" />
      </div>
    </div>
  );
};

export default DsSidebar;
