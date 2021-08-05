import { SetMetadata } from '@nestjs/common';
import { IS_NEED_ACTIVATION } from '../constants';

export const IsNeedActivation = (value = true) =>
  SetMetadata(IS_NEED_ACTIVATION, value);
