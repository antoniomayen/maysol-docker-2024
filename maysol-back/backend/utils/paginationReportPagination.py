from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


DEFAULT_PAGE = 1
DEFAULT_PAGE_SIZE = 10

class CustomPaginationGranja(PageNumberPagination):
    page = DEFAULT_PAGE
    page_size = DEFAULT_PAGE_SIZE
    page_size_query_param = 'page_size'
    sum_items = "0.0"

    #def __init__(self, suma):
    #    self.sum_items = suma
    #    PageNumberPagination.__init__(self)

    def get_paginated_response(self, data):
        return Response({
            'produccion': data.get('produccion'),
            'rentabilidad': data.get('rentabilidad'),
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data.get('data'),
        })
