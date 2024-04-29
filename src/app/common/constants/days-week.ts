export const daysWeek: { [key: string]: string } = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  // saturday: 'Sábado',
  // sunday: 'Domingo',
};

export const listDaysWeek = Object.keys(daysWeek).map((key) => ({
  key,
  label: daysWeek[key],
}));
