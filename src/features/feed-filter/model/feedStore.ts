import { makeAutoObservable } from 'mobx';
import { FeedTier } from '../../../shared/api/types';

class FeedStore {
  activeTier: FeedTier = 'all';

  constructor() {

    makeAutoObservable(this);
  }


  setTier = (tier: FeedTier) => {
    this.activeTier = tier;
  };
}


export const feedStore = new FeedStore();