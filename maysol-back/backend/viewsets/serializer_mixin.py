import logging


class SwappableSerializerMixin(object):

    def get_serializer_class(self):
        logger = logging.getLogger(__name__)
        try:
            return self.serializer_classes[self.request.method]
        except AttributeError:
            logger.debug('%(cls)s does not have the required serializer_classes'
                         'property' % {'cls': self.__class__.__name__})
            return self.serializer_classes['GET']
        except KeyError:
            logger.debug('request method %(method)s is not listed'
                         ' in %(cls)s serializer_classes' %
                         {'cls': self.__class__.__name__,
                          'method': self.request.method})

            return super(SwappableSerializerMixin, self).get_serializer_class()