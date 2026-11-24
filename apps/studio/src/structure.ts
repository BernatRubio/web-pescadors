import type { StructureResolver } from 'sanity/structure';

/** Editor sidebar, in Catalan and ordered by how often each section is used. */
export const structure: StructureResolver = (S) => {
  const singleton = (type: string, title: string) =>
    S.listItem()
      .title(title)
      .id(type)
      .child(S.document().schemaType(type).documentId(type).title(title));

  const list = (type: string, title: string) => S.documentTypeListItem(type).title(title);

  return S.list()
    .title('Contingut')
    .items([
      list('post', 'Notícies'),
      list('event', 'Calendari'),
      list('result', 'Resultats'),
      list('album', 'Galeries'),
      S.divider(),
      S.listItem()
        .title('Sol·licituds noves')
        .icon(() => '🔵')
        .child(
          S.documentList()
            .title('Sol·licituds noves')
            .schemaType('submission')
            .filter('_type == "submission" && status == "nova"')
            .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }]),
        ),
      list('submission', 'Totes les sol·licituds'),
      S.divider(),
      list('course', 'Escola de rem'),
      list('team', 'Equips'),
      list('person', 'Persones'),
      list('boat', 'Flota'),
      list('sponsor', 'Patrocinadors'),
      list('clubDocument', 'Documents'),
      list('page', 'Pàgines'),
      S.divider(),
      singleton('homePage', "Pàgina d'inici"),
      singleton('siteSettings', 'Dades del club'),
      S.listItem()
        .title('Configuració esportiva')
        .icon(() => '🧭')
        .child(
          S.list()
            .title('Configuració esportiva')
            .items([
              list('season', 'Temporades'),
              list('competition', 'Competicions'),
              list('category', 'Categories'),
              list('boatClass', "Tipus d'embarcació"),
            ]),
        ),
    ]);
};
