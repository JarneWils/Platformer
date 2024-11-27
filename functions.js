function collision({
    object1, // is de player
    object2, // is de collisionblock
}) {
    return(
        object1.position.y + object1.height >= object2.position.y && //onderkant player met bovenkant van collision blok
        object1.position.y <= object2.position.y + object2.height && //bovenkant player met onderkant van collision blok
        object1.position.x <= object2.position.x + object2.width && // linkerkant player met rechterkant collision blok
        object1.position.x + object1.width >= object2.position.x //rechterkant player met linkerkant van collision blok
    );
};