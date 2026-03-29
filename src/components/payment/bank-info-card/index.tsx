import { useGetBanking } from 'api/queries';
import { Text, YStack, Card } from 'tamagui';

function BankInfoCard() {
  const { data } = useGetBanking();
  const latestResult = data?.results?.[0] || {};
  const beneficiaryDetails = [
    {
      label: 'Beneficiary account number:',
      value: latestResult.accountNumber || '-',
    },
    {
      label: 'SWIFT code:',
      value: latestResult.swiftCode || '-',
    },
    {
      label: 'Beneficiary name:',
      value: latestResult.beneficiaryName || '-',
    },
    {
      label: 'Beneficiary Address:',
      value: latestResult.beneficiaryAddress || '-',
    },
    {
      label: 'Beneficiary Bank:',
      value: latestResult.beneficiaryBank || '-',
    },
    {
      label: 'Beneficiary Bank address:',
      value: latestResult.beneficiaryBankAddress || '-',
    },
  ];

  return (
    <Card
      borderColor="#E5E5E5"
      borderWidth={1}
      backgroundColor="#fff"
      borderRadius={12}
      padding={16}>
      <YStack gap={16}>
        {beneficiaryDetails.map((detail, index) => (
          <YStack key={index} gap={4}>
            <Text fontSize={12} color="#868889">
              {detail.label}
            </Text>
            <Text fontSize={12} color="#000" fontWeight="600">
              {detail.value}
            </Text>
          </YStack>
        ))}
      </YStack>
    </Card>
  );
}

export default BankInfoCard;
