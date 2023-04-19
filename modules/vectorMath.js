function Vector2(x, y) {
    this.x = x;
    this.y = y;
}
function Vector3(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}
function Vector4(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
}

function ScaleVector(vector, scalar, vectorType) {
    if (vectorType == 2) {
        vector.x *= scalar;
        vector.y *= scalar;
        return vector;
    }
    else if (vectorType == 3) {
        vector.x *= scalar;
        vector.y *= scalar;
        vector.z *= scalar;
        return vector;
    }
    else if (vectorType == 4) {
        vector.x *= scalar;
        vector.y *= scalar;
        vector.z *= scalar;
        vector.w *= scalar;
        return vector;
    }
}

function VectorAdd(VectorA, VectorB, vectorType) {
    if (vectorType == 2) {
        VectorA.x += VectorB.x;
        VectorA.y += VectorB.y;
        return VectorA;
    }
    else if (vectorType == 3) {
        VectorA.x += VectorB.x;
        VectorA.y += VectorB.y;
        VectorA.z += VectorB.z;
        return VectorA;
    }
    else if (vectorType == 4) {
        VectorA.x += VectorB.x;
        VectorA.y += VectorB.y;
        VectorA.z += VectorB.z;
        VectorA.w += VectorB.w;
        return VectorA;
    }
}

function VectorSubtract(VectorA, VectorB, vectorType) {
    if (vectorType == 2) {
        VectorA.x -= VectorB.x;
        VectorA.y -= VectorB.y;
        return VectorA;
    }
    else if (vectorType == 3) {
        VectorA.x -= VectorB.x;
        VectorA.y -= VectorB.y;
        VectorA.z -= VectorB.z;
        return VectorA;
    }
    else if (vectorType == 4) {
        VectorA.x -= VectorB.x;
        VectorA.y -= VectorB.y;
        VectorA.z -= VectorB.z;
        VectorA.w -= VectorB.w;
        return VectorA;
    }
}

function VectorMultiply(VectorA, VectorB, vectorType) {
    if (vectorType == 2) {
        VectorA.x *= VectorB.x;
        VectorA.y *= VectorB.y;
        return VectorA;
    }
    else if (vectorType == 3) {
        VectorA.x *= VectorB.x;
        VectorA.y *= VectorB.y;
        VectorA.z *= VectorB.z;
        return VectorA;
    }
    else if (vectorType == 4) {
        VectorA.x *= VectorB.x;
        VectorA.y *= VectorB.y;
        VectorA.z *= VectorB.z;
        VectorA.w *= VectorB.w;
        return VectorA;
    }
}

function VectorMag (VectorA, vectorType) {
    if (vectorType == 2) {
        var mag = Math.sqrt(Math.pow(VectorA.x, 2) + Math.pow(VectorA.y, 2))
        return mag;
    }
    else if (vectorType == 3) {
        var mag = Math.sqrt(Math.pow(VectorA.x, 2) + Math.pow(VectorA.y, 2) + Math.pow(VectorA.z, 2))
        return mag;
    }
    else if (vectorType == 4) {
        var mag = Math.sqrt(Math.pow(VectorA.x, 2) + Math.pow(VectorA.y, 2) + Math.pow(VectorA.z, 2) + Math.pow(VectorA.w, 2))
        return mag;
    }
}

function VectorNormalise(VectorA, vectorType) {
    var mag = VectorMag(VectorA, vectorType);
    if (vectorType == 2) {
        VectorA.x = VectorA.x / mag;
        VectorA.y = VectorA.y / mag;
        return VectorA.x, VectorA.y;
    }
    else if (vectorType == 3) {
        VectorA.x = VectorA.x / mag;
        VectorA.y = VectorA.y / mag;
        VectorA.z = VectorA.z / mag;
        return VectorA.x, VectorA.y, VectorA.z;
    }
    else if (vectorType == 4) {
        VectorA.x = VectorA.x / mag;
        VectorA.y = VectorA.y / mag;
        VectorA.z = VectorA.z / mag;
        VectorA.w = VectorA.w / mag;
        return VectorA.x, VectorA.y, VectorA.z, VectorA.w;
    }
}

function VectorDivide(VectorA, VectorB, vectorType) {
    if (vectorType == 2) {
        VectorA.x /= VectorB.x;
        VectorA.y /= VectorB.y;
        return VectorA;
    }
    else if (vectorType == 3) {
        VectorA.x /= VectorB.x;
        VectorA.y /= VectorB.y;
        VectorA.z /= VectorB.z;
        return VectorA;
    }
    else if (vectorType == 4) {
        VectorA.x /= VectorB.x;
        VectorA.y /= VectorB.y;
        VectorA.z /= VectorB.z;
        VectorA.w /= VectorB.w;
        return VectorA;
    }
}


export {Vector2, Vector3, Vector4, ScaleVector, VectorAdd, VectorSubtract, VectorDivide, VectorMultiply, VectorMag, VectorNormalise};