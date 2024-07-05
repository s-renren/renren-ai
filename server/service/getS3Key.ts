import type { EntityId } from 'api/@types/brandedId';

export const getContetnKey = (id: EntityId['work']): string => `works/${id}/content.txt`;

export const getImageKey = (id: EntityId['work']): string => `works/${id}/image.png`;
