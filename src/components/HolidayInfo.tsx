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
    <div
      className="position-absolute bottom-0 end-0 m-3 bg-dark border border-secondary rounded overflow-auto text-white"
      style={{ width: "300px", maxHeight: "350px", zIndex: 1000 }}
    >
      <div className="p-3 border-bottom border-secondary">
        <h5 className="mb-1">🎉 Dies festius a {country}</h5>
        <small className="text-secondary">
          {new Date() > new Date(holidays[0].date)
            ? "Festius més recents de "
            : "Propers festius de "}
          {new Date().getFullYear()}
        </small>
      </div>

      <ul className="list-unstyled m-0">
        {holidays.map((holiday, index) => {
          // Formatem la data per mostrar-la
          const dataFestiu = new Date(holiday.date);
          const dataFormatada = dataFestiu.toLocaleDateString("ca-ES", {
            day: "numeric",
            month: "long",
          });

          return (
            <li key={index} className="p-3 border-bottom border-secondary">
              <div className="fw-bold text-primary">{dataFormatada}</div>
              <div className="text-white">{holiday.localName}</div>
              {holiday.localName !== holiday.name && (
                <div className="small text-light fst-italic">
                  {holiday.name}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default HolidayInfo;
