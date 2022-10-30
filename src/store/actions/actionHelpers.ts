import { Dispatch } from 'redux';
import { startLoading, stopLoading } from './generalActions';

export async function tryAsyncWithLoadingState(
  dispatch: Dispatch,
  promise: Promise<any>
): Promise<any> {
  try {
    dispatch(startLoading());
    let res = await promise;
    return Promise.resolve(res);
  } catch (e) {
    alert(e);
  } finally {
    dispatch(stopLoading());
  }
}
