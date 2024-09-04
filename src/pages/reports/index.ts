const ReportsPage = () => import('./ReportsPage.vue');
const HoursPerUserReportPage = () =>
  import('./hours-per-user-report/HoursPerUserReportPage.vue');
const HoursPerProjectReportPage = () =>
  import('./hours-per-project-report/HoursPerProjectReportPage.vue');
const PersonalHoursReportPage = () =>
  import('./personal-hours-report/PersonalHoursReportPage.vue');

export {
  HoursPerProjectReportPage,
  HoursPerUserReportPage,
  PersonalHoursReportPage,
  ReportsPage,
};
