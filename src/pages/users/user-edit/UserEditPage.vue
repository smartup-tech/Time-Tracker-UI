<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Card, PageHeader } from 'ant-design-vue';

import { AddToProject, EditUser } from '@/features/user';
import { UserProjects } from '@/widgets/users';
import { PageName } from '@/pages';
import { useUsersStore } from '@/store';
import { getFullName } from '@/shared/lib';
import { PageBreadcrumbs } from '@/shared/ui';

import { usersBreadcrumbs } from '../config';

import type { UserDetails } from '@/types';

type Props = {
  userId: number;
};

const props = defineProps<Props>();

const { fetchById } = useUsersStore();

const userModel = ref<UserDetails | undefined>();

const activeTab = ref<string>('profile');
const tabList = [
  {
    key: 'profile',
    tab: 'Профиль',
    route: PageName.USER_EDIT,
  },
  {
    key: 'projects',
    tab: 'Проекты',
    route: PageName.USER_EDIT_PROJECTS,
  },
];

const title = computed<string>(
  () => `Редактировать профиль сотрудника: ${getFullName(userModel.value)}`
);

const route = useRoute();
const router = useRouter();

const goToUserList = () => router.push({ name: PageName.USERS });

const goToTabRoute = (key: string) => {
  const tabProperty = tabList.find((item) => item.key == key);
  if (tabProperty) {
    router.push({ name: tabProperty.route });
  }
};

const switchTabByRoute = () => {
  const tabProperty = tabList.find((tab) => tab.route == route.name);
  if (tabProperty) {
    activeTab.value = tabProperty.key;
  }
};

watch(() => route.name, switchTabByRoute);

onBeforeMount(async () => {
  switchTabByRoute();
  if (props.userId) {
    userModel.value = await fetchById(props.userId);
  }
});

const onChange = async (model: UserDetails) => {
  userModel.value = model;
};
</script>

<template>
  <PageHeader class="page-header" :title="title">
    <template #breadcrumb>
      <PageBreadcrumbs :breadcrumbs="usersBreadcrumbs" />
    </template>
  </PageHeader>

  <Card
    :bordered="false"
    :active-tab-key="activeTab"
    :tab-list="tabList"
    @tab-change="goToTabRoute"
  >
    <template v-if="activeTab === 'profile'">
      <EditUser
        v-if="!!userModel"
        :model="userModel"
        @success="goToUserList"
        @change="onChange"
        @cancel="goToUserList"
      />
    </template>

    <template v-if="activeTab === 'projects'">
      <UserProjects class="user-details__projects" :user-id="props.userId" />
    </template>

    <template #tabBarExtraContent>
      <template v-if="activeTab === 'profile'">
        <div></div>
      </template>
      <template v-if="activeTab === 'projects'">
        <AddToProject :user-id="props.userId" />
      </template>
    </template>
  </Card>
</template>

<style lang="scss" scoped>
.user-details__projects {
  margin-right: -24px;
  margin-left: -24px;
}
</style>
