export async function getFavouritedVideos(userId: string, token: string) {
  const operationsDoc = `
  query mylistVideos($userId: String!) {
    stats(where: {
      userId: {_eq: $userId},
      favourited: {_eq: 1}
    }) {
      userId
      videoId
      favourited
    }
  }`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "mylistVideos",
    {
      userId,
    },
    token
  )

  return response?.data?.stats;
}

export async function getWatchedVideos(userId: string, token: string) {
  const operationsDoc = `
  query watchedVideos($userId: String!) {
    stats(where: {
      userId: {_eq: $userId},
      watched: {_eq: true}
    }) {
      userId
      videoId
      watched
    }
  }`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "watchedVideos",
    {
      userId,
    },
    token
  )

  return response?.data?.stats;
}


export async function insertStats(token: string, { favourited, userId, watched, videoId }: { favourited: number, userId: string, watched?: boolean, videoId: string }) {
  const operationsDoc = `
    mutation insertStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
    insert_stats_one(object: {
      favourited: $favourited,
      userId: $userId,
      videoId: $videoId,
      watched: $watched
    }) {
      favourited
      userId
      videoId
      watched
    }
  }
  `;

  return await queryHasuraGQL(
    operationsDoc,
    "insertStats",
    {
      favourited,
      userId,
      watched,
      videoId 
    },
    token
  )
}



export async function updateStats(token: string, { favourited, userId, watched, videoId }: { favourited?: number, userId: string, watched?: boolean, videoId: string }) {
  const operationsDoc = `
    mutation updateStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
      update_stats(
        _set: {watched: $watched, favourited: $favourited},
        where: {
          userId: {_eq: $userId},
          videoId: {_eq: $videoId}
        }) {
        returning {
          favourited
          userId
          videoId
          watched
        }
      }
    }
  `;

  return await queryHasuraGQL(
    operationsDoc,
    "updateStats",
    {
      favourited,
      userId,
      watched,
      videoId 
    },
    token
  )
}

export async function findVideoIdByUser(userId: string, videoId: string, token: string) {
  const operationsDoc = `
  query findVideoIdByUserId($issuer: String!, $videoId: String!) {
    stats(where: {userId: {_eq: $issuer}, videoId: {_eq: $videoId}}) {
      id
      userId
      videoId
      watched
      favourited
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "findVideoIdByUserId",
    {
      issuer: userId,
      videoId
    },
    token
  )

  return response?.data?.stats;
}

export async function createNewUser(token: string, metadata) {
  const operationsDoc = `
  mutation createNewUser($issuer: String!, $email: String! $publicAddress: String!) {
    insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
      returning {
        email
        id
        issuer
      }
    }
  }
`;
  const { issuer, email, publicAddress } = metadata
  const response = await queryHasuraGQL(
    operationsDoc,
    "createNewUser",
    {
      issuer,
      email,
      publicAddress
    },
    token
  )

  return response
}

export async function isNewUser(token: string, issuer: string) {
  const operationsDoc = `
   query isNewUser($issuer: String!) {
     users(where: {issuer: {_eq: $issuer}}) {
       email
       id
       issuer
     }
   }
 `;

  const response = await queryHasuraGQL(
    operationsDoc,
    "isNewUser",
    {
      issuer,
    },
    token
  )

  return response?.data?.users?.length === 0;
}

export async function queryHasuraGQL(operationsDoc: string, operationName: string, variables, token: string) {
   

    const result = await fetch(
      process.env.NEXT_PUBLIC_HASURA_ADMIN_URL,
      {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          query: operationsDoc,
          variables: variables,
          operationName: operationName
        })
      }
    );
  
    return await result.json();
  }
  
  
  
  