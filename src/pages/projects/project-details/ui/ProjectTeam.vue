<script lang="ts" setup>
import { reactive } from 'vue';
import {
  Button,
  Popconfirm,
  Select,
  Space,
  Table,
  TableProps,
  Tooltip,
} from 'ant-design-vue';

import { TeamRole, teamRoles } from '@/constants';
import { LAIcon, NumberInput } from '@/shared/ui';
import { useNumberFormat } from '@/shared/lib';
import { useProjectsDetailsStore } from '@/store';

import type { CreateTeamMember, TeamMember } from '@/types';

type Props = {
  projectId: number;
  team: TeamMember[];
  loading: boolean;
};

const props = defineProps<Props>();

const { addToTeam, removeFromTeam } = useProjectsDetailsStore();

const editable: Record<string, CreateTeamMember> = reactive({});

const columns: TableProps['columns'] = [
  {
    key: 'name',
    title: 'Имя',
    width: 180,
    minWidth: 180,
  },
  {
    key: 'role',
    title: 'Роль',
    width: 180,
    minWidth: 180,
  },
  {
    key: 'rate',
    title: 'Ставка',
    width: 120,
    align: 'right',
  },
  {
    key: 'actions',
    align: 'right',
    width: 104,
    fixed: 'right',
  },
];

const roleOptions = Object.values(TeamRole).map((value) => ({
  label: teamRoles[value],
  value,
}));

const edit = (user: TeamMember) => {
  const { id: userId, externalRate, projectRoleId } = user;

  editable[createUid(user)] = { userId, externalRate, projectRoleId };
};

const cancelEdit = (uid: string) => delete editable[uid];

const save = async (uid: string) => {
  await addToTeam(props.projectId, editable[uid]);
  delete editable[uid];
};

const getUsername = (user: TeamMember) => {
  return `${user.firstName} ${user.lastName}`;
};

const remove = async (user: TeamMember) =>
  await removeFromTeam(props.projectId, user.id);

const createUid = ({ id, projectRoleId }: TeamMember): string =>
  `${id}.${projectRoleId}`;
</script>

<template>
  <div>
    <Table
      table-layout="fixed"
      :loading="loading"
      :columns="columns"
      :data-source="props.team"
      :pagination="false"
      :scroll="{ x: 600 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          {{ getUsername(record as TeamMember) }}
        </template>
        <template v-if="column.key === 'role'">
          <Select
            v-if="editable[createUid(record as TeamMember)]"
            :options="roleOptions"
            v-model:value="editable[createUid(record as TeamMember)].projectRoleId"
            style="width: 100%"
          />
          <template v-else>
            {{ teamRoles[record.projectRoleId as TeamRole] }}
          </template>
        </template>
        <template v-if="column.key === 'rate'">
          <NumberInput
            v-if="editable[createUid(record as TeamMember)]"
            :min="0"
            v-model:value="editable[createUid(record as TeamMember)].externalRate"
            style="width: 100%"
          />
          <template v-else>
            {{ useNumberFormat(record.externalRate) }}
          </template>
        </template>
        <template v-if="column.key === 'actions'">
          <Space>
            <template v-if="editable[createUid(record as TeamMember)]">
              <Tooltip title="Сохранить">
                <Button
                  shape="circle"
                  type="text"
                  @click="save(createUid(record as TeamMember))"
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
                  @click="cancelEdit(createUid(record as TeamMember))"
                >
                  <template #icon>
                    <LAIcon icon="times" size="large" />
                  </template>
                </Button>
              </Tooltip>
            </template>
            <template v-else>
              <Tooltip title="Изменить">
                <Button
                  shape="circle"
                  type="text"
                  @click="edit(record as TeamMember)"
                >
                  <template #icon>
                    <LAIcon icon="pen" size="large" />
                  </template>
                </Button>
              </Tooltip>

              <Popconfirm placement="topRight" @confirm="remove(record  as TeamMember)">
                <template #title> Удалить сотрудника из команды? </template>
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
