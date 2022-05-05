import { Detail } from "@navikt/ds-react";

const FindPrevRes = ({ prevCounter, currentCount }) => {
  if (prevCounter === currentCount) return <span>Ingen endringer</span>;
  if (prevCounter) {
    return prevCounter >= currentCount ? (
      <Detail as="span" className="text-green-400">{`+${
        prevCounter - currentCount
      } | ${Math.floor((prevCounter / currentCount) * 100 - 100)}%`}</Detail>
    ) : (
      <Detail as="span" className="text-red-400">{`-${
        prevCounter - currentCount
      } | ${Math.floor((prevCounter / currentCount) * 100 - 100)}%`}</Detail>
    );
  }

  return <span>Ingen tidligere data</span>;
};

export default FindPrevRes;
