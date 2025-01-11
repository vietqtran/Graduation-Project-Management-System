export enum STATUS_MASTER {
  REQUIRED = 1,
  WAITING = 2,
  PENDING = 3,
  REJECTED = 4,
  CLOSED = 5,
  EXPIRED = 6,
  REGISTERED = 7,
  ACTIVATED = 8,
  PROCESSING = 9,
  COMPLETED = 10,
  MATCHED = 11,
  UN_MATCHED = 12,
  UN_SUBMITTED = 13,
  SCHEDULED = 14,
  DRAFT = 15,
  SUBMITTED = 16,
  APPROVED = 17,
  CANCELLED = 18,
  BLOCKED = 19,
  UN_ACTIVE = 20
}

export enum USER_STATUS {
  CLOSED = STATUS_MASTER.CLOSED,
  REGISTERED = STATUS_MASTER.REGISTERED,
  BLOCKED = STATUS_MASTER.BLOCKED,
  UN_ACTIVE = STATUS_MASTER.UN_ACTIVE,
  ACTIVATED = STATUS_MASTER.ACTIVATED
}

export enum ACCOUNT_STATUS {
  CLOSED = STATUS_MASTER.CLOSED,
  REGISTERED = STATUS_MASTER.REGISTERED,
  BLOCKED = STATUS_MASTER.BLOCKED,
  UN_ACTIVE = STATUS_MASTER.UN_ACTIVE,
  ACTIVATED = STATUS_MASTER.ACTIVATED
}
