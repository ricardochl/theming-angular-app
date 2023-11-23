import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  get storage(): Storage {
    return localStorage;
  }

  setItem(key: string, value: any) {
    this.storage.setItem(key, JSON.stringify(value));
  }
  getItem(key: string): any {
    const stringifiedValue = this.storage.getItem(key) ?? 'null';

    return stringifiedValue === 'undefined' ? undefined : JSON.parse(stringifiedValue);
  }
  removeItem(key: string) {
    this.storage.removeItem(key);
  }
  clear(): void {
    this.storage.clear();
  }
}
