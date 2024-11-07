import { makeAutoObservable } from 'mobx';

import { SpatialObject } from '../models/state';

class SpatialObjectStore {
  objects: SpatialObject[] = [];

  addSpatialObject(object: SpatialObject) {
    this.objects = [...this.objects, object];
  }

  removeSpatialObject(id: string) {
    this.objects = this.objects.filter((object) => object.feature.id !== id);
  }

  changeSpatialObjectName(id: string, name: string) {
    this.objects = this.objects.map((object) =>
      object.feature.id === id ? { ...object, name } : object
    );
  }

  toggleSpatialObjectEditMode(id: string) {
    this.objects = this.objects.map((object) =>
      object.feature.id === id ? { ...object, edit: !object.edit } : object
    );
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new SpatialObjectStore();
