alpine-node-nginx
===

В этом пакете хранится базовый образ, используемый для проектов на arui-scripts.
В образ включен nodejs и nginx с простейшей базовой конфигурацией.

Сборка и публикация образа осуществляется с помощью github-actions при каждом пуше в мастер.
Собираются сразу несколько версий контейнера, с разными версиями nodejs внутри. Только одна из них будет помечена как latest,
на данный момент это `14.21.3`. Другие доступные версии:

- 14.21.3
- 16.20.2
- 18.16.0

### Локальная сборка контейнера
Если вы хотите собрать локально, выполните

```sh
docker build --build-arg NODE_VERSION=14.17.6 --build-arg ALPINE_VERSION=3.16 -t alfabankui/arui-scripts:14.17.6 .
```

### Локальная сборка на arm-процессорах
Если у вас ноутбук на M1 - по умолчанию docker build будет собирать контейнер именно под arm архитектуру, и запустить
его на наших серверах будет невозможно. Поэтому собирать нужно немного иначе:

```sh
docker buildx build --platform linux/amd64 --build-arg NODE_VERSION=16.20.2 --build-arg ALPINE_VERSION=3.18 -t alfabankui/arui-scripts:test --load .

docker buildx build --platform linux/amd64 --build-arg NODE_VERSION=16.20.2 -f Dockerfile-debian -t alfabankui/arui-scripts:test --load .
```
