import { defineStore } from 'pinia';
import pick from 'lodash/pick';

import { UserRole, TeamRole } from '@/constants';
import { authApi, profileApi } from '@/shared/api';
import { resetAllStores } from '@/store';

import type {
  Credentials,
  PasswordReset,
  PasswordUpdate,
  PersonalData,
  Profile,
  ProfileUpdate,
} from '@/types';
import type { AuthState } from './types';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    profile: null,
  }),

  persist: true,

  actions: {
    async login(credentials: Credentials) {
      await authApi.login(credentials);
      await this.fetchProfile();
    },

    async logout() {
      await authApi.logout();
      resetAllStores();
    },

    async fetchProfile() {
      const profile = await profileApi.fetchProfile();

      this.setProfile(profile);
    },

    async updateProfile(profile: PersonalData) {
      const updatedProfile = await profileApi.updateProfile(
        pick<PersonalData, keyof ProfileUpdate>(profile, [
          'firstName',
          'lastName',
          'middleName',
        ])
      );

      this.setProfile(updatedProfile);
    },

    async updatePassword({ newPassword, oldPassword }: PasswordUpdate) {
      await profileApi.updatePassword({
        newPassword,
        oldPassword,
      });
    },

    async requestPasswordRecovery(email: string) {
      await authApi.requestPasswordRecoveryLink({ email });
    },

    async resetPassword({ newPassword, token }: PasswordReset) {
      await authApi.resetPassword({ newPassword, token });
    },

    setProfile(profile: Profile) {
      this.profile = profile;
    },
  },

  getters: {
    isAuthenticated: (state): boolean => Boolean(state.profile),

    hasUserRole: (state): boolean =>
      state.profile?.roles?.includes(UserRole.ROLE_USER) || false,

    hasAdminRole: (state): boolean =>
      state.profile?.roles?.includes(UserRole.ROLE_ADMIN) || false,

    hasManagerRole(state): boolean {
      return (
        this.hasUserRole &&
        Boolean(state.profile?.projectRoles?.includes(TeamRole.MANAGER))
      );
    },

    hasReportViewRole: (state): boolean =>
      state.profile?.roles?.includes(UserRole.ROLE_REPORT_RECEIVER) || false,

    canViewTracker(): boolean {
      return this.hasUserRole || this.hasAdminRole;
    },

    canViewCalendar(): boolean {
      return this.hasUserRole || this.hasAdminRole || this.hasReportViewRole;
    },

    canCreateProjects(): boolean {
      return this.hasAdminRole;
    },

    canViewProjects(): boolean {
      return this.hasAdminRole || this.hasManagerRole;
    },

    canArchiveProjects(): boolean {
      return this.hasAdminRole;
    },

    canCreateUsers(): boolean {
      return this.hasAdminRole;
    },

    canViewUsers(): boolean {
      return this.hasAdminRole;
    },

    canEditProductionCalendar(): boolean {
      return this.hasAdminRole;
    },

    canArchiveUsers(): boolean {
      return this.hasAdminRole;
    },

    canManageTimesheets(): boolean {
      return this.hasAdminRole || this.hasManagerRole;
    },

    canViewPositions(): boolean {
      return this.hasAdminRole;
    },

    canCreatePositions(): boolean {
      return this.hasAdminRole;
    },

    canArchivePositions(): boolean {
      return this.hasAdminRole;
    },

    canViewReports(): boolean {
      return this.hasAdminRole || this.hasReportViewRole || this.hasManagerRole;
    },

    canViewTimeFreeze(): boolean {
      return this.hasAdminRole;
    },

    canApproveTimesheets(): boolean {
      return this.hasAdminRole || this.hasManagerRole;
    },
  },
});
