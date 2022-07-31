# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.158.0/containers/typescript-node/.devcontainer/base.Dockerfile

ARG VARIANT="14"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${VARIANT}

# Set an environment variable to be able to detect we are in dev container
ENV NODE_ENV=devcontainer

EXPOSE 3000

COPY .nvmrc /tmp/.nvmrc
RUN \
  su node -c \
    "source /usr/local/share/nvm/nvm.sh && nvm install $(cat /tmp/.nvmrc) 2>&1"
