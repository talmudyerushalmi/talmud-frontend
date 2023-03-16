import { Dispatch } from 'redux';
import { startLoading, stopLoading } from './generalActions';

export async function tryAsyncWithLoadingState<T>(dispatch: Dispatch, promise: Promise<T>): Promise<T> {
  try {
    dispatch(startLoading());
    let res = await promise;
    return Promise.resolve(res);
  } catch (e) {
    alert(e);
    return Promise.reject()
  } finally {
    dispatch(stopLoading());
  }
}
