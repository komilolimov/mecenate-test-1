import { makeAutoObservable } from 'mobx';


export type FeedTier = 'all' | 'free' | 'paid';

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