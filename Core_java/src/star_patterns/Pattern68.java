package star_patterns;

public class Pattern68 {

	public static void main(String[] args) 
	{
		int num = 69;
		for(int i=1; i<=5; i++)
		{
			
			for(int j = 1; j<=5; j++)
			{
				if(j<=i)
				{
                 System.out.print((char)num);
                 
				}
				else
				{
					System.out.print(" ");
				}
			}
			System.out.println();
			num--;
		}
	}
}