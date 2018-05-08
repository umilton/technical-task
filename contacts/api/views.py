from contacts.models import Contact
from rest_framework import generics
from .serializers import ContactSerializer

# create a new contact, gets the all contact List
class ContactList(generics.ListCreateAPIView):
    
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer


class ContactRud(generics.RetrieveUpdateDestroyAPIView):
    
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
