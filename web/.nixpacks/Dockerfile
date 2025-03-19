FROM ghcr.io/railwayapp/nixpacks:ubuntu-1741046653

ENTRYPOINT ["/bin/bash", "-l", "-c"]
WORKDIR /app/


COPY ./web/.nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix
RUN nix-env -if .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix && nix-collect-garbage -d


ARG CI NIXPACKS_METADATA NODE_ENV NPM_CONFIG_PRODUCTION
ENV CI=$CI NIXPACKS_METADATA=$NIXPACKS_METADATA NODE_ENV=$NODE_ENV NPM_CONFIG_PRODUCTION=$NPM_CONFIG_PRODUCTION

# setup phase
# noop

# install phase
ENV NIXPACKS_PATH=/app/node_modules/.bin:$NIXPACKS_PATH
COPY . /app/.
RUN --mount=type=cache,id=n1juX80NWQ4-/root/npm,target=/root/.npm bun i --filter ./web --no-save

# build phase
COPY . /app/.
RUN --mount=type=cache,id=n1juX80NWQ4-next/cache,target=/app/.next/cache --mount=type=cache,id=n1juX80NWQ4-node_modules/cache,target=/app/node_modules/.cache bun build:web


RUN printf '\nPATH=/app/node_modules/.bin:$PATH' >> /root/.profile


# start
COPY . /app

CMD ["bun start:web"]

