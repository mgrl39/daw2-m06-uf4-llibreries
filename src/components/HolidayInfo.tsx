import { HolidayInfo as HolidayInfoType } from "../types/IpInfo";

interface HolidayInfoProps {
  holidays: HolidayInfoType[];
  country: string;
  isVisible: boolean;
}

/**
 * Component per mostrar els dies festius d'un país
 */
const HolidayInfo = ({ holidays, country, isVisible }: HolidayInfoProps) => {
  if (!isVisible || holidays.length === 0) return null;

  return (
    <div className="festius-contenidor">
      <div className="festius-capcalera">
        <h5>🎉 Dies festius a {country}</h5>
        <span className="festius-subtitol">
          {new Date() > new Date(holidays[0].date)
            ? "Festius més recents de "
            : "Propers festius de "}
          {new Date().getFullYear()}
        </span>
      </div>

      <ul className="festius-llista">
        {holidays.map((holiday, index) => {
          // Formatem la data per mostrar-la
          const dataFestiu = new Date(holiday.date);
          const dataFormatada = dataFestiu.toLocaleDateString("ca-ES", {
            day: "numeric",
            month: "long",
          });

          return (
            <li key={index} className="festiu-item">
              <div className="festiu-data">{dataFormatada}</div>
              <div className="festiu-nom">{holiday.localName}</div>
              {holiday.localName !== holiday.name && (
                <div className="festiu-nom-intl">{holiday.name}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default HolidayInfo;
