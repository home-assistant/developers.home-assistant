---
title: Authentication
sidebar_label: Introduction
id: version-0.77.0-auth_index
original_id: auth_index
---

Home Assistant has a built-in authentication system allowing different users to interact with Home Assistant. The authentication system consist of various parts.

![Overview of how the different parts interact](/img/en/auth/architecture.png)

## Authentication providers

An authentication provider is used for users to authenticate themselves. It's up to the authentication provider to choose the method of authentication and the backend to use. By default we enable the built-in Home Assistant authentication provider which stores the users securely inside your configuration directory.

The authentication providers that Home Assistant will use are specified inside `configuration.yaml`. It is possible to have multiple instances of the same authentication provider active. In that case, each will be identified by a unique identifier. Authentication providers of the same type will not share credentials.

## Credentials

Credentials store the authentication of a user with a specific authentication provider. It is produced when a user successfully authenticates. It will allow the system to find the user in our system. If the user does not exist, a new user will be created. This user will not be activated but will require approval by the owner.

It is possible for a user to have multiple credentials linked to it. However, it can only have a single credential per specific authentication provider.

## Users

Each person is a user in the system. To log in as a specific user, authenticate with any of the authentication providers that are linked to this user. When a user logs in, it will get a refresh and an access token to make requests to Home Assistant.

### Owner

The first user to log in to Home Assistant will be marked as the owner. This user is able to manage users.

## Clients

Clients are applications that users use to access the Home Assistant API. Each client has a client identifier, a redirect uri and an optional client secret. The redirect uri is used to redirect the user after it has successfully authorized.

## Access and refresh tokens

The client will be provided with an authorization code when a user successfully authorizes with Home Assistant. This code can be used to retrieve an access and a refresh token. The access token will have a limited lifetime while refresh tokens will remain valid until a user deletes it.

The access token is used to access the Home Assistant APIs. The refresh token is used to retrieve a new valid access token.
