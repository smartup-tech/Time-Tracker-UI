export enum ErrorCode {
  NOT_UNIQUE_POSITION_NAME = 'NOT_UNIQUE_POSITION_NAME',
  NOT_UNIQUE_PROJECT_NAME = 'NOT_UNIQUE_PROJECT_NAME',
  NOT_UNIQUE_USER_NAME = 'NOT_UNIQUE_USER_NAME',
  NOT_UNIQUE_TASK_NAME = 'NOT_UNIQUE_TASK_NAME',
  NOT_PROCESSED_TRACK_UNITS_FOR_TASK = 'NOT_PROCESSED_TRACK_UNITS_FOR_TASK',
  NOT_PROCESSED_TRACK_UNITS_FOR_PROJECT = 'NOT_PROCESSED_TRACK_UNITS_FOR_PROJECT',
  NOT_PROCESSED_TRACK_UNITS_FOR_USER = 'NOT_PROCESSED_TRACK_UNITS_FOR_USER',
  RELATED_ENTITIES_FOUND_FOR_POSITION = 'RELATED_ENTITIES_FOUND_FOR_POSITION',
  RELATED_ENTITIES_FOUND_FOR_USER = 'RELATED_ENTITIES_FOUND_FOR_USER',
}

export const Errors: Record<string, string> = {
  [ErrorCode.NOT_UNIQUE_POSITION_NAME]:
    'Должность с таким названием уже существует',

  [ErrorCode.NOT_UNIQUE_PROJECT_NAME]:
    'Проект с таким названием уже существует',

  [ErrorCode.NOT_UNIQUE_USER_NAME]:
    'Сотрудник с таким адресом эл. почты уже существует',

  [ErrorCode.NOT_UNIQUE_TASK_NAME]: 'Задача с таким названием уже существует',

  [ErrorCode.NOT_PROCESSED_TRACK_UNITS_FOR_TASK]:
    'Проверьте наличие необработанных записей о затраченном времени.',

  [ErrorCode.NOT_PROCESSED_TRACK_UNITS_FOR_PROJECT]:
    'Проверьте наличие необработанных записей о затраченном времени.',

  [ErrorCode.NOT_PROCESSED_TRACK_UNITS_FOR_USER]:
    'Проверьте наличие необработанных записей о затраченном времени.',

  [ErrorCode.RELATED_ENTITIES_FOUND_FOR_POSITION]:
    'Найдены активные сотрудники с этой должностью.',

  [ErrorCode.RELATED_ENTITIES_FOUND_FOR_USER]:
    'Сотрудник будет удален из проектов:',
};
