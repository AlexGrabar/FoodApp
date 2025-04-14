import { makeAutoObservable, runInAction, observable, IObservableValue } from 'mobx';

interface Identifiable {
    id: number;
}
interface PaginatedResponse<Item> {
  results: Item[];
  offset: number;
  number: number;
  totalResults: number;
}
type FetcherParams<ExternalParams extends object> = ExternalParams & {
    offset: number;
    number: number;
};

export class CollectionStore<Item extends Identifiable, ExternalParams extends object> {
  private _list: Item[] = [];
  private _isLoading: boolean = false;
  private _isInitialLoading: boolean = false;
  private _error: string | null = null;
  private _hasMore: boolean = true;
  private _offset: number = 0;
  private _totalResults: number = 0;
  private readonly _lastUsedExternalParamsBox: IObservableValue<ExternalParams | null>;
  private readonly _fetcherMethod: (params: FetcherParams<ExternalParams>) => Promise<PaginatedResponse<Item>>;
  private readonly _pageSize: number;

  constructor(
      fetcherMethod: (params: FetcherParams<ExternalParams>) => Promise<PaginatedResponse<Item>>,
      pageSize: number
  ) {
    this._fetcherMethod = fetcherMethod;
    this._pageSize = pageSize;
    this._lastUsedExternalParamsBox = observable.box<ExternalParams | null>(null, { deep: false });
    makeAutoObservable(this, {}, { autoBind: true });
  }

  private get _lastUsedExternalParams(): ExternalParams | null { return this._lastUsedExternalParamsBox.get(); }
  private set _lastUsedExternalParams(value: ExternalParams | null) { this._lastUsedExternalParamsBox.set(value); }

  get list(): Item[] { return this._list; }
  get isLoading(): boolean { return this._isLoading; }
  get isInitialLoading(): boolean { return this._isInitialLoading; }
  get error(): string | null { return this._error; }
  get hasMore(): boolean { return this._hasMore; }
  get offset(): number { return this._offset; }
  get totalResults(): number { return this._totalResults; }
  get isEmpty(): boolean { return !this._isLoading && this._list.length === 0 && !this._error; }
  get isListEmptyAndNotLoading(): boolean { return !this.isLoading && this.list.length === 0; }

  async loadInitial(params: ExternalParams): Promise<void> {
     runInAction(() => {
        this._isLoading = true;
        this._isInitialLoading = true;
        this._error = null;
        this._list = [];
        this._offset = 0;
        this._hasMore = true;
        this._totalResults = 0;
        this._lastUsedExternalParams = params;
    });
    await this._fetch(0);
  }

  async loadMore(): Promise<void> {
    if (!this._hasMore || this._isLoading || !this._lastUsedExternalParams) return;
    runInAction(() => { this._isLoading = true; });
    const nextOffset = this._offset + this._pageSize;
    await this._fetch(nextOffset);
  }

  reset(): void {
    runInAction(() => {
        this._list = [];
        this._isLoading = false;
        this._isInitialLoading = false;
        this._error = null;
        this._hasMore = true;
        this._offset = 0;
        this._totalResults = 0;
        this._lastUsedExternalParams = null;
    });
  }

  private async _fetch(requestOffset: number): Promise<void> {
       const currentParams = this._lastUsedExternalParams;
       if (!currentParams) {
           runInAction(() => {
               this._isLoading = false;
               this._isInitialLoading = false;
           });
           console.warn("CollectionStore: Attempted to fetch without external parameters.");
           return;
       }
       const isInitial = this._isInitialLoading;
       const fetchParams: FetcherParams<ExternalParams> = { ...currentParams, offset: requestOffset, number: this._pageSize };
       try {
           const response = await this._fetcherMethod(fetchParams);
           runInAction(() => {
               const newItems = response.results;
               const uniqueNewItems = newItems.filter(
                   newItem => !this._list.some(existing => existing.id === newItem.id)
               );
               this._list = isInitial ? uniqueNewItems : [...this._list, ...uniqueNewItems];
               this._totalResults = response.totalResults;
               this._offset = requestOffset;
               this._hasMore = this._list.length < this._totalResults;
               this._error = null;
           });
       } catch (err: unknown) {
           let errorMessage = 'Failed to fetch data. Please try again later.';
           if (err instanceof Error) { errorMessage = err.message; }
           runInAction(() => {
               this._error = errorMessage;
               this._hasMore = false;
           });
       } finally {
           runInAction(() => {
               this._isLoading = false;
               if (isInitial) { this._isInitialLoading = false; }
           });
       }
   }

   destroy(): void {
    console.log('CollectionStore destroyed');
   }
}