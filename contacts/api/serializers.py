from rest_framework import serializers
from contacts.models import Contact

class ContactSerializer(serializers.ModelSerializer):

    class Meta:
        model = Contact
        fields = ('id', 'name', 'number')
    
    # validation for duplicate name
    def validate_name(self, given_name):
        name_matched = Contact.objects.filter(name__iexact=given_name)

        if self.instance:
            name_matched = name_matched.exclude(pk=self.instance.pk)  # exclude own name from the list of matched names

        if name_matched.exists():
            raise serializers.ValidationError("Name already exists")

        return given_name

    # validation for duplicate number
    def validate_contact_number(self, given_number):
        number_matched = Contact.objects.filter(contact_number__iexact=given_number)

        if self.instance:
            number_matched = number_matched.exclude(pk=self.instance.pk)

        if number_matched.exists():
            raise serializers.ValidationError("Number already exists")

        return given_number


