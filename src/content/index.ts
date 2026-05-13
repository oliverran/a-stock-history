import type { HubDef, Market } from './types';
import { cnBroadHub } from './cn/broad';
import { cnSectorsHub } from './cn/sectors';
import { cnClustersHub } from './cn/clusters';
import { usSp500Hub } from './us/sp500';
import { usNasdaqHub } from './us/nasdaq';
import { usDowHub } from './us/dow';
import { usSemiHub } from './us/semi';
import { usXlkHub } from './us/xlk';
import { usFinHub } from './us/fin';
import { usMag7Hub } from './us/mag7';

const hubs: HubDef[] = [
  cnBroadHub,
  cnSectorsHub,
  cnClustersHub,
  usSp500Hub,
  usNasdaqHub,
  usDowHub,
  usSemiHub,
  usXlkHub,
  usFinHub,
  usMag7Hub,
];

export function listHubs() {
  return hubs;
}

export function getHub(market: Market, module: string) {
  return hubs.find((h) => h.market === market && h.module === module);
}

