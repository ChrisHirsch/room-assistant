import KalmanFilter from 'kalmanjs';

type Constructable = new (...args: any[]) => object;

// tslint:disable-next-line:typedef
export function KalmanFilterable<BC extends Constructable>(
  Base: BC,
  R: number = 1,
  Q: number = 1
) {
  return class extends Base {
    kalmanFilterMap: Map<string, KalmanFilter> = new Map<
      string,
      KalmanFilter
    >();

    /**
     * Smoothes a given value using a Kalman filter.
     * Optionally can use different filter instances per passed id.
     *
     * @param value - Value to be filtered
     * @param id - ID to group values together in separated filters
     * @returns Filtered value
     */
    kalmanFilter(value: number, id: string = 'default'): number {
      if (this.kalmanFilterMap.has(id)) {
        return this.kalmanFilterMap.get(id).filter(value);
      } else {
        const kalman = new KalmanFilter({ R, Q });
        this.kalmanFilterMap.set(id, kalman);
        return kalman.filter(value);
      }
    }
  };
}
