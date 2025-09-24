export const EnumAcciones = {
  CRUD: [
    {
      editar: {
        label: 'Editar',
        action: 'edit',
        icon: 'fa fa-edit',
        class: 'btn btn-sm btn-primary'
      }
    },
    {
      eliminar: {
        label: 'Eliminar',
        action: 'delete',
        icon: 'fa fa-trash',
        class: 'btn btn-sm btn-danger'
      }
    }
  ],
  VIEW_ONLY: [
    {
      ver: {
        label: 'Ver',
        action: 'view',
        icon: 'fa fa-eye',
        class: 'btn btn-sm btn-info'
      }
    }
  ]
  // Puedes agregar más conjuntos de acciones aquí
};