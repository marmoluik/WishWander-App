export interface DataAccessLog {
  id: string;
  actor: string;
  resource: string;
  action: 'read' | 'write' | 'export' | 'delete';
  timestamp: Date;
}

const dataAccessLogs: DataAccessLog[] = [];

export const logDataAccess = (entry: DataAccessLog) => {
  dataAccessLogs.push(entry);
};

export const getDataAccessLogs = () => dataAccessLogs;

export const clearDataAccessLogs = () => {
  dataAccessLogs.length = 0;
};
