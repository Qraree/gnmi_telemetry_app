import { JSX, useEffect, useState } from "react";
import { breadcrumbsMap } from "../utils/constants.ts";
import { Link, useLocation } from "react-router";

export const useBreads = () => {
  const location = useLocation();
  const [breads, setBreads] = useState<{ title: string | JSX.Element }[]>();

  useEffect(() => {
    const breadcrumbs = [];
    const pathLocations = location.pathname.split("/");
    for (let i = 1; i < pathLocations.length; i++) {
      const currentBread = breadcrumbsMap[pathLocations[i]];
      breadcrumbs.push({
        title: <Link to={currentBread.link}>{currentBread.title}</Link>,
      });

      const isNotArrayEnd = i + 1 < pathLocations.length;

      if (isNotArrayEnd && currentBread.childTitle) {
        breadcrumbs.push({
          title: currentBread.childTitle,
        });
        i++;
      }
    }

    setBreads([{ title: "Главная" }, ...breadcrumbs]);
  }, [location.pathname]);

  return breads;
};
