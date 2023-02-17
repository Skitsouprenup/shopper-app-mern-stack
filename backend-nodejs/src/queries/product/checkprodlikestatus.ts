
/*
    These functions only take one id in likedUsers
    since we are just looking for one specific id.
*/

export const checkIfCategoryLike = (userId: string) => {
    return {
        $eq: [
            {
                $first: {
                    $getField: {
                        field: 'likedUsers',
                        input: {
                            $first: {
                                $filter: {
                                    input: '$likes',
                                    cond: {
                                        $eq: [
                                            '$$this.dbRefId',
                                            '$_id',
                                        ]
                                    }
                                }
                            },
                        }
                    }
                }
            }, userId
        ],
    }
}

export const checkIfPopularLike = (userId: string) => {
    return {
        $eq: [
            {
                $first: {
                    $filter: {
                        input: '$likedUsers',
                        cond: {
                            $eq: [
                                '$$this',
                                userId
                            ]
                        }
                    }
                }
            }, userId
        ]
    }
}