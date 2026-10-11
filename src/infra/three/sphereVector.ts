import { Vector3 } from 'three';

import type { SpherePoint } from '../../domain/model/SpherePoint';

function toVector3( point: SpherePoint ): Vector3 {

	return new Vector3( point.x, point.y, point.z );

}

export { toVector3 };
