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
    <div className="bg-dark border border-secondary rounded">
      <div className="p-3 border-bottom border-secondary">
        <h5 className="text-warning mb-1">🎉 Festius - {country}</h5>
        <small>
          {new Date() > new Date(holidays[0].date)
            ? "Festius més recents"
            : "Propers festius"}
        </small>
      </div>

      <div className="p-2">
        {holidays.map((holiday, index) => {
          const dataFestiu = new Date(holiday.date);
          const dataFormatada = dataFestiu.toLocaleDateString("ca-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          return (
            <div
              key={index}
              className="p-2 mb-2 bg-dark rounded border border-secondary"
            >
              <div className="text-info fw-bold">{dataFormatada}</div>
              <div className="mt-1">{holiday.localName}</div>
              {holiday.localName !== holiday.name && (
                <div className="small text-secondary">{holiday.name}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HolidayInfo;
