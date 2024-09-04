<script lang="ts" setup>
import { onBeforeMount, onBeforeUnmount, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import {
  Button,
  Popconfirm,
  Select,
  Space,
  Table,
  Tooltip,
} from 'ant-design-vue';

import { useUserProjectsConfig } from './config';

import { TeamRole, teamRoles } from '@/constants';
import { LAIcon, NumberInput } from '@/shared/ui';
import { useUserProjectsStore } from '@/store';

import type { BodyCell, CreateUserProject, UserProject } from '@/types';

type Props = {
  userId: number;
};

const { columns } = useUserProjectsConfig();

const props = defineProps<Props>();

const store = useUserProjectsStore();
const { fetchUserProjects, addUserToProject, removeUserFromProject } = store;
const { isLoading, projects  } = storeToRefs(store);

const editable: Record<string, CreateUserProject> = reactive({});

const roleOptions = Object.values(TeamRole).map((value) => ({
  label: teamRoles[value],
  value,
}));

const edit = (project: UserProject) => {
  const { id, externalRate, projectRoleId } = project;

  editable[createUid(project)] = { projectId: id, externalRate, projectRoleId };
};

const cancelEdit = (uid: string) => delete editable[uid];

const save = async (uid: string) => {
  await addUserToProject(props.userId, editable[uid]);
  delete editable[uid];
};

const remove = async (project: UserProject) => {
  await removeUserFromProject(props.userId, project.id);
};

const createUid = ({ id, projectRoleId }: UserProject): string =>
  `${id}.${projectRoleId}`;

onBeforeMount(async () => {
  await fetchUserProjects(props.userId);
});

onBeforeUnmount(() => {
  store.$reset();
});
</script>

<template>
  <div>
    <Table
      table-layout="fixed"
      :loading="isLoading"
      :columns="columns"
      :data-source="projects"
      :pagination="false"
    >
      <template #bodyCell="{ column, record } : BodyCell">
        <template v-if="column.key === 'name'">
          {{ record.name }}
        </template>
        <template v-if="column.key === 'role'">
          <Select
            v-if="editable[createUid(record)]"
            :options="roleOptions"
            v-model:value="editable[createUid(record)].projectRoleId"
            style="width: 100%"
          />
          <template v-else>
            {{ teamRoles[record.projectRoleId as TeamRole] }}
          </template>
        </template>
        <template v-if="column.key === 'rate'">
          <NumberInput
            v-if="editable[createUid(record)]"
            :min="0"
            v-model:value="editable[createUid(record)].externalRate"
            style="width: 100%"
          />
          <template v-else>
            {{ record.externalRate }}
          </template>
        </template>
        <template v-if="column.key === 'actions'">
          <Space>
            <template v-if="editable[createUid(record)]">
              <Tooltip title="Сохранить">
                <Button
                  shape="circle"
                  type="text"
                  @click="save(createUid(record))"
                >
                  <template #icon>
                    <LAIcon icon="check" size="large" />
                  </template>
                </Button>
              </Tooltip>
              <Tooltip title="Отмена">
                <Button
                  shape="circle"
                  type="text"
                  @click="cancelEdit(createUid(record))"
                >
                  <template #icon>
                    <LAIcon icon="times" size="large" />
                  </template>
                </Button>
              </Tooltip>
            </template>
            <template v-else>
              <Tooltip title="Изменить">
                <Button shape="circle" type="text" @click="edit(record)">
                  <template #icon>
                    <LAIcon icon="pen" size="large" />
                  </template>
                </Button>
              </Tooltip>

              <Popconfirm placement="topRight" @confirm="remove(record)">
                <template #title> Удалить сотрудника из проекта? </template>
                <Tooltip title="Удалить">
                  <Button shape="circle" type="text">
                    <template #icon>
                      <LAIcon icon="trash" size="large" />
                    </template>
                  </Button>
                </Tooltip>
              </Popconfirm>
            </template>
          </Space>
        </template>
      </template>
    </Table>
  </div>
</template>
